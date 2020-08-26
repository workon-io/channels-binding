deploy:
	python3 publish.py patch

deploy_minor:
	python3 publish.py minor

deploy_major:
	python3 publish.py major

develop:
	sudo pip3 install .
	python3 setup.py develop --user

undevelop:
	sudo pip uninstall channels-binding 
	
clean:
	find . -type f -name "*.pyc" -delete
	rm -rf nosetests.xml coverage.xml htmlcov *.egg-info *.pdf dist violations.txt
